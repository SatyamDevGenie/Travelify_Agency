export const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => {
            throw new Error("Failed to load Razorpay SDK");
        };
        document.body.appendChild(script);
    });
};


