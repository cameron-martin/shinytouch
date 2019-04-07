import PerspectiveTransform from "./perspective-transform";

test("no-op transform is a no-op", () => {
  const examples = [
    { to: { x: 0, y: 0 }, from: { x: 0, y: 0 } },
    { to: { x: 0, y: 1 }, from: { x: 0, y: 1 } },
    { to: { x: 1, y: 0 }, from: { x: 1, y: 0 } },
    { to: { x: 1, y: 1 }, from: { x: 1, y: 1 } },
  ];

  const transform = PerspectiveTransform.fromExamples(examples);

  const transformed = transform.forward({ x: 1, y: 1 });

  expect(transformed.x).toBeCloseTo(1, 10);
  expect(transformed.y).toBeCloseTo(1, 10);
});
