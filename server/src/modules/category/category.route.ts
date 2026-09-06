// category.route.ts for category module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { categoryController, authMiddleware } from "../container";
import { CategoryValidator } from "./category.validator";

const categoryRouter = Router();
const { validateEndpoint, paramsIdValidator } = BaseValidator;
const { newCategoryValidator, updateCategoryValidator } = CategoryValidator;

/**
 * @openapi
 * /category/all:
 *   get:
 *     summary: List all categories
 *     tags: [Category]
 *     security: []
 *     responses:
 *       200: { description: Array of categories }
 */
categoryRouter.get("/all", validateEndpoint(), categoryController.getAll);

categoryRouter.use(authMiddleware.authentic);

/**
 * @openapi
 * /category/data/{id}:
 *   get:
 *     summary: Get a single category by id
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The category }
 */
categoryRouter.get(
  "/data/:id",
  validateEndpoint(paramsIdValidator),
  categoryController.getById
);

categoryRouter.use(authMiddleware.isAdmin);

/**
 * @openapi
 * /category/new:
 *   post:
 *     summary: Create a category (admin only)
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryName]
 *             properties:
 *               categoryName: { type: string }
 *     responses:
 *       200: { description: Category created/updated }
 *       403: { description: Not an admin }
 */
categoryRouter.post(
  "/new",
  validateEndpoint(newCategoryValidator),
  categoryController.create
);

/**
 * @openapi
 * /category/{id}:
 *   put:
 *     summary: Update a category (admin only)
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryName]
 *             properties:
 *               categoryName: { type: string }
 *     responses:
 *       200: { description: Category updated }
 *       403: { description: Not an admin }
 *   delete:
 *     summary: Delete a category (admin only)
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted }
 *       403: { description: Not an admin }
 */
categoryRouter.put(
  "/:id",
  validateEndpoint(updateCategoryValidator),
  categoryController.updateById
);
categoryRouter.delete(
  "/:id",
  validateEndpoint(paramsIdValidator),
  categoryController.deleteById
);

export default categoryRouter;
