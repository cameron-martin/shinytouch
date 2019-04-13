import ContainTransform from "./ContainTransform";

it("is the identity function when src and dest are equal", () => {
  const transform = new ContainTransform(
    { width: 1, height: 1 },
    { width: 1, height: 1 },
  );

  expect(transform.inverse({ x: 2, y: 2 })).toEqual({ x: 2, y: 2 });
});

it("preserves center", () => {
  const transform = new ContainTransform(
    { width: 100, height: 400 },
    { width: 50, height: 100 },
  );

  expect(transform.inverse({ x: 25, y: 50 })).toEqual({ x: 50, y: 200 });
});
