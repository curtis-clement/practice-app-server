const {Router} = require('express');
const auth = require('../auth/middleware');
const HomePage = require('../models').homepage
const Story = require('../models').story

const router = new Router();


//get all homepages ----- includes stories
router.get('/homepages', async(request, response) => {
  const homepages = await HomePage.findAll({
    include: [Story],
    order: [[Story, 'createdAt', 'DESC']]
  });
  response.status(200).send({message: 'ok', homepages})
});

//get hompages by ID
router.get('/homepages/:id', async (request, response) => {
  const id = request.params.id;
  const homePageDetails = await HomePage.findByPk(id);
  response.status(200).json(homePageDetails);
})

router.patch('/homepages/:id', auth, async(request, response, next) => {
  const id = parseInt(request.params.id)
  
  try {
    const updateHomePage = await HomePage.findByPk(id);
    const newHomePage = await updateHomePage.update(request.body)
    response.json(newHomePage)
  } catch(error) {
    next(error)
  }
})

router.post('/homepages/:id/stories', auth, async(request, response, next) => {
  const homepage = await HomePage.findByPk(request.params.id);

  const {name, content, imageUrl} = request.body

  try {
    const newStory = await Story.create({
      name,
      content,
      imageUrl,
      homepageId: homepage.id
    })
    response.json(newStory)
  } catch(error) {
    next(error)
  }
});

module.exports = router;








// router.patch('/:id', auth, async (request, response) => {
//   const hompage = await HomePage.findByPk(request.params.id);
//   if (!homepage.userId === request.user.id) {
//     return response
//       .status(403)
//       .send({message: 'You are not authorized to update this page'})
//   }

// router.get("/", async (req, res) => {
//   const limit = req.query.limit || 10;
//   const offset = req.query.offset || 0;
//   const homepages = await Homepage.findAndCountAll({
//     limit,
//     offset,
//     include: [Story],
//     order: [[Story, "createdAt", "DESC"]]
//   });
//     res.status(200).send({ message: "ok", homepages });
//   });

//   const {title, descrption, backgroudnColor, color} = request.body;

//   await homepage.update({title, description, backgroudnColor, color});

//   return response.status(200).send({homepage});
// });

// module.exports = router;