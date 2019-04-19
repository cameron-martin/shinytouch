const API_HOST = process.env.API_HOST;

interface ExampleMetadata {
  /**
   * The position of the fingertip in the video frame.
   */
  videoPosition: { x: number; y: number };
  /**
   * The position of the fingertip on the screen.
   */
  screenPosition: { x: number; y: number };
  /**
   * The size of the screen in pixels.
   */
  screenSize: { width: number; height: number };
}

export default class ApiClient {
  /**
   * @param image An image encoded using JPEG
   */
  async addExample(
    calibrationSessionId: string,
    image: Blob,
    metadata: ExampleMetadata,
  ): Promise<void> {
    const body = new FormData();

    body.append("metadata", JSON.stringify(metadata));
    body.append("frame", image);

    const response = await fetch(
      `${API_HOST}/add-example?calibrationSessionId=${calibrationSessionId}`,
      {
        method: "POST",
        body,
      },
    );

    if (!response.ok) throw new Error("Request failed");
  }
}
