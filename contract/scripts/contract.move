
module steganography_contract::image_store {
    use std::vector;
    use std::error;
    use aptos_framework::signer;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use aptos_framework::account::new_event_handle;

    /// Error codes
    const E_ALREADY_INITIALIZED: u64 = 1;
    const E_NOT_INITIALIZED: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_IMAGE_NOT_FOUND: u64 = 4;
    const E_INVALID_IMAGE_HASH: u64 = 5;

    /// Struct to store image metadata
    struct ImageMetadata has store, drop, copy {
        owner: address,
        image_hash: vector<u8>,
        timestamp: u64,
        has_hidden_message: bool
    }

    /// Event for when a new image is stored
    struct ImageStoredEvent has drop, store {
        owner: address,
        image_hash: vector<u8>,
        timestamp: u64
    }

    /// Resource to store all images for an account
    struct UserImages has key {
        images: vector<ImageMetadata>,
        store_events: EventHandle<ImageStoredEvent>,
    }

    /// Initialize user's image storage
    public entry fun initialize_storage(account: &signer) {
        let user_addr = signer::address_of(account);
        
        assert!(!exists<UserImages>(user_addr), error::already_exists(E_ALREADY_INITIALIZED));
        
        move_to(account, UserImages {
            images: vector::empty(),
            store_events: new_event_handle<ImageStoredEvent>(account),
        });
    }

    /// Helper function to check if image already exists
    fun image_exists(images: &vector<ImageMetadata>, image_hash: &vector<u8>): bool {
        let len = vector::length(images);
        let i = 0;
        
        while (i < len) {
            let metadata = vector::borrow(images, i);
            if (metadata.image_hash == *image_hash) {
                return true
            };
            i = i + 1;
        };
        
        false
    }

    /// Store new image metadata
    public entry fun store_image(
        account: &signer,
        image_hash: vector<u8>,
        has_hidden_msg: bool
    ) acquires UserImages {
        let user_addr = signer::address_of(account);
        
        // Validate inputs
        assert!(exists<UserImages>(user_addr), error::not_found(E_NOT_INITIALIZED));
        assert!(!vector::is_empty(&image_hash), error::invalid_argument(E_INVALID_IMAGE_HASH));

        let user_images = borrow_global_mut<UserImages>(user_addr);
        
        // Check for duplicate image hash
        assert!(!image_exists(&user_images.images, &image_hash), error::already_exists(E_ALREADY_INITIALIZED));

        let current_timestamp = timestamp::now_microseconds();

        let metadata = ImageMetadata {
            owner: user_addr,
            image_hash,
            timestamp: current_timestamp,
            has_hidden_message: has_hidden_msg,
        };

        vector::push_back(&mut user_images.images, metadata);

        // Emit event
        event::emit_event(&mut user_images.store_events, ImageStoredEvent {
            owner: user_addr,
            image_hash,
            timestamp: current_timestamp,
        });
    }

    /// Get all images for an account
    public fun get_user_images(user_addr: address): vector<ImageMetadata> acquires UserImages {
        assert!(exists<UserImages>(user_addr), error::not_found(E_NOT_INITIALIZED));
        
        let user_images = borrow_global<UserImages>(user_addr);
        *&user_images.images
    }

    /// Check if image has hidden message
    public fun has_hidden_message(
        user_addr: address,
        image_hash: vector<u8>
    ): bool acquires UserImages {
        assert!(exists<UserImages>(user_addr), error::not_found(E_NOT_INITIALIZED));
        assert!(!vector::is_empty(&image_hash), error::invalid_argument(E_INVALID_IMAGE_HASH));

        let user_images = borrow_global<UserImages>(user_addr);
        let len = vector::length(&user_images.images);
        let i = 0;
        
        while (i < len) {
            let metadata = vector::borrow(&user_images.images, i);
            if (metadata.image_hash == image_hash) {
                return metadata.has_hidden_message
            };
            i = i + 1;
        };
        
        false
    }

    /// Remove image metadata
    public entry fun remove_image(
        account: &signer,
        image_hash: vector<u8>
    ) acquires UserImages {
        let user_addr = signer::address_of(account);
        
        // Validate inputs
        assert!(exists<UserImages>(user_addr), error::not_found(E_NOT_INITIALIZED));
        assert!(!vector::is_empty(&image_hash), error::invalid_argument(E_INVALID_IMAGE_HASH));

        let user_images = borrow_global_mut<UserImages>(user_addr);
        let len = vector::length(&user_images.images);
        let i = 0;
        
        while (i < len) {
            let metadata = vector::borrow(&user_images.images, i);
            if (metadata.image_hash == image_hash) {
                vector::remove(&mut user_images.images, i);
                return
            };
            i = i + 1;
        };

        // Image not found
        abort error::not_found(E_IMAGE_NOT_FOUND)
    }
}
