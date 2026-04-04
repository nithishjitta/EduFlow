package com.elearning.elearningserver.controller;

import com.elearning.elearningserver.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import com.stripe.model.checkout.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // GET /api/v1/stripekey  (public)
    @GetMapping("/stripekey")
    public ResponseEntity<Map<String, Object>> getStripeKey() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "key", paymentService.getPublishableKey()
        ));
    }

    // GET /api/v1/subscribe
    @GetMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> buySubscription(
            @AuthenticationPrincipal UserDetails userDetails) throws StripeException {
        Map<String, String> result = paymentService.buySubscription(userDetails.getUsername());
        return ResponseEntity.status(201).body(Map.of(
                "success",   true,
                "sessionId", result.get("sessionId"),
                "url",       result.get("url")
        ));
    }
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;
    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/buy-course")
    public Map<String, String> buyCourse(@RequestBody Map<String, Object> data) throws Exception {

        Stripe.apiKey = stripeSecretKey;

        String title = data.get("title").toString();
        int price = Integer.parseInt(data.get("price").toString());

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(frontendUrl + "/paymentsuccess")
                        .setCancelUrl(frontendUrl + "/paymentfail")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount((long) price * 100)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName(title)
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        Session session = Session.create(params);

        return Map.of("id", session.getId());
    }
    // POST /api/v1/verifystripe
    @PostMapping("/verifystripe")
    public ResponseEntity<Map<String, Object>> verifyStripe(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String session_id) throws StripeException {
        paymentService.verifyStripe(userDetails.getUsername(), session_id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // DELETE /api/v1/subscribe/cancel
    @DeleteMapping("/subscribe/cancel")
    public ResponseEntity<Map<String, Object>> cancelSubscription(
            @AuthenticationPrincipal UserDetails userDetails) throws StripeException {
        paymentService.cancelSubscription(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Subscription cancelled successfully."
        ));
    }
}