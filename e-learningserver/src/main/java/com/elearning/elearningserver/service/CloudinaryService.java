package com.elearning.elearningserver.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    @Autowired(required = false)
    private Cloudinary cloudinary;

    public Map<String, String> uploadImage(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            throw new IOException("Cloudinary service is not available");
        }
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "elearning")
        );
        return Map.of(
                "publicId", (String) result.get("public_id"),
                "url",      (String) result.get("secure_url")
        );
    }

    public Map<String, String> uploadVideo(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            throw new IOException("Cloudinary service is not available");
        }
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "folder", "elearning"
                )
        );
        return Map.of(
                "publicId", (String) result.get("public_id"),
                "url",      (String) result.get("secure_url")
        );
    }

    public void deleteImage(String publicId) throws IOException {
        if (cloudinary == null) {
            throw new IOException("Cloudinary service is not available");
        }
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public void deleteVideo(String publicId) throws IOException {
        if (cloudinary == null) {
            throw new IOException("Cloudinary service is not available");
        }
        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap("resource_type", "video")
        );
    }

    public boolean isAvailable() {
        return cloudinary != null;
    }
}