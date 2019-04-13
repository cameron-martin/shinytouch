export default class ApiClient {
  /**
   * @param image An image encoded using JPEG
   */
  async addExample(image: Blob): Promise<void> {
    const response = await fetch("http://localhost:5678/add-example", {
      method: "POST",
      body: image,
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

    if (!response.ok) throw new Error("Request failed");
  }
}
