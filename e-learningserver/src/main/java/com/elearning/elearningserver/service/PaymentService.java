package com.elearning.elearningserver.service;

import com.elearning.elearningserver.exception.AppException;
import com.elearning.elearningserver.model.Payment;
import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.repository.PaymentRepository;
import com.elearning.elearningserver.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerRetrieveParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionRetrieveParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Value("${stripe.price-id}")
    private String priceId;

    @Value("${stripe.publishable-key}")
    private String publishableKey;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // ── Get Stripe Publishable Key ────────────────────────────────────────────
    public String getPublishableKey() {
        return publishableKey;
    }

    // ── Buy Subscription ──────────────────────────────────────────────────────
    public Map<String, String> buySubscription(String userId) throws StripeException {
        User user = getUser(userId);

        if ("admin".equals(user.getRole()))
            throw new AppException("Admin can't buy subscription", HttpStatus.BAD_REQUEST);

        Customer customer = resolveOrCreateCustomer(user);

        Session session = Session.create(
                SessionCreateParams.builder()
                        .setCustomer(customer.getId())
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setPrice(priceId)
                                        .setQuantity(1L)
                                        .build()
                        )
                        .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                        .setSuccessUrl(frontendUrl + "/paymentsuccess?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl(frontendUrl + "/paymentfail")
                        .build()
        );

        if (user.getSubscription() == null) user.setSubscription(new User.Subscription());
        user.getSubscription().setStatus("pending");
        userRepository.save(user);

        return Map.of(
                "sessionId", session.getId(),
                "url",       session.getUrl()
        );
    }

    // ── Verify Stripe Session ─────────────────────────────────────────────────
    public void verifyStripe(String userId, String sessionId) throws StripeException {
        if (sessionId == null || sessionId.isBlank())
            throw new AppException("session_id is required", HttpStatus.BAD_REQUEST);

        Session session = Session.retrieve(
                sessionId,
                SessionRetrieveParams.builder()
                        .addExpand("subscription")
                        .build(),
                null
        );

        if (!"paid".equals(session.getPaymentStatus()))
            throw new AppException("Payment not successful", HttpStatus.BAD_REQUEST);

        User user = getUser(userId);

        // Avoid duplicate Payment records
        String paymentIntentId = session.getPaymentIntent();
        if (paymentIntentId != null &&
                paymentRepository.findByStripePaymentIntentId(paymentIntentId).isEmpty()) {
            Payment payment = new Payment();
            payment.setStripePaymentIntentId(paymentIntentId);
            payment.setAmount(session.getAmountTotal());
            paymentRepository.save(payment);
        }

        // Store subscription ID
        String subscriptionId = session.getSubscription();
        if (session.getSubscriptionObject() != null)
            subscriptionId = session.getSubscriptionObject().getId();

        if (user.getSubscription() == null) user.setSubscription(new User.Subscription());
        user.getSubscription().setId(subscriptionId);
        user.getSubscription().setStatus("active");
        userRepository.save(user);
    }

    // ── Cancel Subscription ───────────────────────────────────────────────────
    public void cancelSubscription(String userId) throws StripeException {
        User user = getUser(userId);

        String subscriptionId = user.getSubscription() != null
                ? user.getSubscription().getId() : null;

        if (subscriptionId == null)
            throw new AppException("No active subscription found", HttpStatus.BAD_REQUEST);

        try {
            Subscription subscription = Subscription.retrieve(subscriptionId);
            subscription.cancel();
        } catch (StripeException e) {
            if (!"resource_missing".equals(e.getCode())) throw e;
            // Already cancelled on Stripe side — clean up locally anyway
        }

        user.getSubscription().setId(null);
        user.getSubscription().setStatus("inactive");
        userRepository.save(user);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private Customer resolveOrCreateCustomer(User user) throws StripeException {
        if (user.getStripeCustomerId() != null) {
            try {
                Customer customer = Customer.retrieve(user.getStripeCustomerId());
                if (Boolean.TRUE.equals(customer.getDeleted())) throw new RuntimeException("deleted");
                return customer;
            } catch (Exception e) {
                // Fall through to create new customer
            }
        }
        Customer customer = Customer.create(
                CustomerCreateParams.builder()
                        .setEmail(user.getEmail())
                        .setName(user.getName())
                        .build()
        );
        user.setStripeCustomerId(customer.getId());
        userRepository.save(user);
        return customer;
    }
}