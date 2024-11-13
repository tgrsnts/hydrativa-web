export default interface Review {
    rating: number;
    comment: string;
    image?: File | null;  // Optional field for the uploaded image
    imagePreview?: string | null;  // Optional field for the image preview (base64 or URL)
}
