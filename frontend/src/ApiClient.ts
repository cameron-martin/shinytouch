const API_HOST = process.env.API_HOST || 'http://localhost:5678';

export default class ApiClient {
  /**
   * @param image An image encoded using JPEG
   */
  async addExample(image: Blob): Promise<void> {
    const response = await fetch(`${API_HOST}/add-example`, {
      method: "POST",
      body: image,
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

    if (!response.ok) throw new Error("Request failed");
  }
}
