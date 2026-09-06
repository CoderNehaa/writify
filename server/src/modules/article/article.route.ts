// article.route.ts for article module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { articleController, authMiddleware } from "../container";
import { ArticleValidator } from "./article.validator";
import { uploadImage } from "../../clients/multer.service";

const articleRouter = Router();
const { validateEndpoint, paramsIdValidator } = BaseValidator;
const { newArticleValidator, updateArticleValidator, listArticlesValidator } =
  ArticleValidator;

articleRouter.use(authMiddleware.authentic);

/**
 * @openapi
 * /article/new:
 *   post:
 *     summary: Create a new article (draft or published)
 *     tags: [Article]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, category]
 *             properties:
 *               title: { type: string }
 *               content: { type: string, description: Rich-text HTML from the editor }
 *               category: { type: string, description: Category ObjectId }
 *               status: { type: string, enum: [draft, published] }
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       200: { description: Article created }
 */
articleRouter.post(
  "/new",
  uploadImage.any(),
  validateEndpoint(newArticleValidator),
  articleController.create
);

/**
 * @openapi
 * /article/all:
 *   get:
 *     summary: List articles (published only, unless filtering by your own author id)
 *     tags: [Article]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *     responses:
 *       200: { description: Array of articles }
 */
articleRouter.get(
  "/all",
  validateEndpoint(listArticlesValidator),
  articleController.getAll
);

/**
 * @openapi
 * /article/data/{id}:
 *   get:
 *     summary: Get a single article by id (drafts are only visible to their author)
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The article }
 *       404: { description: Not found (or a draft belonging to someone else) }
 */
articleRouter.get(
  "/data/:id",
  validateEndpoint(paramsIdValidator),
  articleController.getById
);

/**
 * @openapi
 * /article/{id}:
 *   put:
 *     summary: Update an article (author only)
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               category: { type: string }
 *               status: { type: string, enum: [draft, published] }
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       200: { description: Article updated }
 *       403: { description: Not the article's author }
 *   delete:
 *     summary: Delete an article (author only)
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Article deleted }
 *       403: { description: Not the article's author }
 */
articleRouter.put(
  "/:id",
  uploadImage.any(),
  validateEndpoint(updateArticleValidator),
  articleController.updateById
);
articleRouter.delete(
  "/:id",
  validateEndpoint(paramsIdValidator),
  articleController.deleteById
);

export default articleRouter;
