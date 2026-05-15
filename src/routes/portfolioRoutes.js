const express = require("express");
const portfolioController = require("../controllers/portfolioController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { createPortfolioItemValidation, freelancerPortfolioValidation, updatePortfolioItemValidation } = require("../validators/portfolioValidators");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/me", protect, allowRoles(USER_ROLES.FREELANCER), portfolioController.getMyPortfolio);
router.get("/freelancer/:freelancerId", freelancerPortfolioValidation, validate, portfolioController.getFreelancerPortfolio);
router.post("/", protect, allowRoles(USER_ROLES.FREELANCER), createPortfolioItemValidation, validate, portfolioController.createPortfolioItem);
router.patch("/:id", protect, allowRoles(USER_ROLES.FREELANCER), updatePortfolioItemValidation, validate, portfolioController.updatePortfolioItem);
router.delete("/:id", protect, allowRoles(USER_ROLES.FREELANCER), updatePortfolioItemValidation, validate, portfolioController.deletePortfolioItem);

module.exports = router;
