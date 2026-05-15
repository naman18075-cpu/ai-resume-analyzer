const { sequelize, User, Job, Bid, Review } = require("../models");
const { USER_ROLES, JOB_STATUSES, BID_STATUSES } = require("../utils/constants");

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const [adminClient, verifiedClient, unverifiedClient, freelancerOne, freelancerTwo, freelancerThree] =
      await Promise.all([
        User.create({
          name: "Admin Client",
          email: "admin@example.com",
          password: "Password123",
          role: USER_ROLES.CLIENT,
          city: "Bengaluru",
          isVerified: true
        }),
        User.create({
          name: "Rahul Client",
          email: "rahul.client@example.com",
          password: "Password123",
          role: USER_ROLES.CLIENT,
          city: "Mumbai",
          isVerified: true
        }),
        User.create({
          name: "Sneha Client",
          email: "sneha.client@example.com",
          password: "Password123",
          role: USER_ROLES.CLIENT,
          city: "Delhi",
          isVerified: false
        }),
        User.create({
          name: "Aarav Freelancer",
          email: "aarav.freelancer@example.com",
          password: "Password123",
          role: USER_ROLES.FREELANCER,
          city: "Pune",
          isVerified: true
        }),
        User.create({
          name: "Meera Freelancer",
          email: "meera.freelancer@example.com",
          password: "Password123",
          role: USER_ROLES.FREELANCER,
          city: "Jaipur",
          isVerified: true
        }),
        User.create({
          name: "Kabir Freelancer",
          email: "kabir.freelancer@example.com",
          password: "Password123",
          role: USER_ROLES.FREELANCER,
          city: "Hyderabad",
          isVerified: true
        })
      ]);

    const [openJob, inProgressJob, completedJob] = await Promise.all([
      Job.create({
        title: "Build a responsive company website",
        description: "Need a simple website with 6 pages, contact form, and basic SEO setup.",
        budgetMin: 20000,
        budgetMax: 35000,
        deadline: "2026-05-15",
        skillsRequired: ["HTML", "CSS", "JavaScript"],
        locationPreference: "remote",
        clientId: verifiedClient.id,
        status: JOB_STATUSES.OPEN
      }),
      Job.create({
        title: "Create a social media content calendar",
        description: "Need a freelancer to plan and write 30 days of engaging social media posts.",
        budgetMin: 10000,
        budgetMax: 15000,
        deadline: "2026-05-05",
        skillsRequired: ["Content Writing", "Marketing"],
        locationPreference: "Mumbai",
        clientId: adminClient.id,
        status: JOB_STATUSES.IN_PROGRESS
      }),
      Job.create({
        title: "Design a startup pitch deck",
        description: "Need a polished 12-slide deck for fundraising and client presentations.",
        budgetMin: 12000,
        budgetMax: 18000,
        deadline: "2026-04-20",
        skillsRequired: ["Presentation Design", "Branding"],
        locationPreference: "remote",
        clientId: verifiedClient.id,
        status: JOB_STATUSES.COMPLETED
      })
    ]);

    await Promise.all([
      Bid.create({
        jobId: openJob.id,
        freelancerId: freelancerOne.id,
        price: 28000,
        proposalText: "I can deliver the website with SEO-friendly structure and responsive pages in one week.",
        estimatedTime: "7 days",
        status: BID_STATUSES.PENDING,
        matchScore: 0.84
      }),
      Bid.create({
        jobId: openJob.id,
        freelancerId: freelancerTwo.id,
        price: 30000,
        proposalText: "I specialize in clean business websites and can also help with deployment support.",
        estimatedTime: "6 days",
        status: BID_STATUSES.PENDING,
        matchScore: 0.79
      }),
      Bid.create({
        jobId: inProgressJob.id,
        freelancerId: freelancerThree.id,
        price: 13500,
        proposalText: "I have handled content calendars for multiple brands and can deliver copy plus scheduling plan.",
        estimatedTime: "5 days",
        status: BID_STATUSES.ACCEPTED,
        matchScore: 0.88
      }),
      Bid.create({
        jobId: inProgressJob.id,
        freelancerId: freelancerOne.id,
        price: 14500,
        proposalText: "I can structure a month-long campaign and optimize copy for engagement goals.",
        estimatedTime: "6 days",
        status: BID_STATUSES.REJECTED,
        matchScore: 0.74
      }),
      Bid.create({
        jobId: completedJob.id,
        freelancerId: freelancerTwo.id,
        price: 16000,
        proposalText: "I can create a strong investor-ready deck with clean visual hierarchy and storytelling flow.",
        estimatedTime: "4 days",
        status: BID_STATUSES.ACCEPTED,
        matchScore: 0.91
      })
    ]);

    await Review.create({
      jobId: completedJob.id,
      reviewerId: verifiedClient.id,
      revieweeId: freelancerTwo.id,
      rating: 5,
      comment: "Strong communication and excellent deck quality. Delivered on time."
    });

    await freelancerTwo.update({
      rating: 5,
      completedJobs: 1
    });

    console.log("Seed data inserted successfully.");
    console.log("Sample login password for all users: Password123");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seed();
