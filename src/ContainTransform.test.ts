import ContainTransform from "./ContainTransform";

it("is the identity function when src and dest are equal", () => {
  const transform = new ContainTransform({ x: 1, y: 1 }, { x: 1, y: 1 });

  expect(transform.inverse({ x: 2, y: 2 })).toEqual({ x: 2, y: 2 });
});

it("preserves center", () => {
  const transform = new ContainTransform({ x: 100, y: 400 }, { x: 50, y: 100 });

  expect(transform.inverse({ x: 25, y: 50 })).toEqual({ x: 50, y: 200 });
});
