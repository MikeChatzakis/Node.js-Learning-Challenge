const express = require('express');
const router = express.Router();
const Post=require('../models/Post');

/**  
 * GET /
 * HOME
*/

//router for home page
router.get('', async (req,res)=>{
    try { 
        const locals = {
            title: "My Page",
            description: "Simple Page created with NodeJs. Express, MongoDB."
        }
        let perPage =3;
        let page=req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt:-1}}])
        .skip(perPage*page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) +1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);


        res.render('index',{
            locals, 
            data,
            current: page,
            nextPage: hasNextPage?nextPage:null,
            currentRoute: '/'

        });
    } catch (error) {
        console.log(error);
    }
});

/**  
 * GET /
 * Post :id
*/

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Page created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});

/**  
 * GET /
 * Post :searchTerm
*/

router.post('/search', async (req, res) => {
    try {   
      const locals = {
        title: "Search",
        description: "Simple Page created with NodeJs, Express & MongoDb.",
      }

      let searchTerm=req.body.searchTerm;
      const  searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g,"");

      const data = await Post.find({
        $or:[
            {title:{ $regex: new RegExp(searchNoSpecialChar,'i')}},
            {body:{ $regex: new RegExp(searchNoSpecialChar,'i')}}
        ]
      });
  
      res.render("search",{
        data,
        locals
      });
    } catch (error) {
      console.log(error);
    }
  });


//router for about page
router.get('/about',(req,res)=>{
    res.render('about',{
        currentRoute:'/about'
    });
});

module.exports = router;





//this is used once. 
/*
function insertPostData(){
    Post.insertMany([
        {
            title: "Journey to Andromeda",
            body: "We embarked on a journey to the Andromeda Galaxy, marveling at its spiral arms and the promise of countless stars and planets waiting to be discovered."
        },
        {
            title: "Mysteries of the Milky Way",
            body: "The Milky Way stretched across the sky, a band of light made up of billions of stars. Its mysteries and hidden wonders have captivated astronomers for centuries."
        },
        {
            title: "Exploring the Magellanic Clouds",
            body: "The Magellanic Clouds, two irregular dwarf galaxies, offered a glimpse into the chaotic beauty of the cosmos. Their proximity to the Milky Way provided endless opportunities for exploration."
        },
        {
            title: "Secrets of the Sombrero Galaxy",
            body: "The Sombrero Galaxy, with its bright nucleus and large central bulge, resembled a cosmic hat. Studying its structure revealed secrets about galaxy formation and evolution."
        },
        {
            title: "Adventures in the Whirlpool Galaxy",
            body: "The Whirlpool Galaxy's majestic spiral arms were a sight to behold. Its interaction with a neighboring galaxy sparked wonder and a deeper understanding of gravitational forces."
        },
        {
            title: "Whispers in the Shadows",
            body: "The old mansion was said to be haunted, with whispers echoing through the halls at night. Visitors often spoke of a ghostly presence watching from the shadows."
        },
        {
            title: "The Enchanted Forest",
            body: "Deep within the forest, strange lights danced among the trees. Legend had it that fairies and other mystical creatures called this place home, guarding their secrets closely."
        },
        {
            title: "The Cursed Amulet",
            body: "An ancient amulet, said to be cursed, brought misfortune to anyone who possessed it. Its dark history was filled with tales of sorrow and inexplicable events."
        },
        {
            title: "Visions of the Future",
            body: "She had the gift of foresight, glimpses of the future that came to her in dreams. Her visions, though often cryptic, held the power to alter the course of events."
        },
        {
            title: "The Phantom's Lament",
            body: "Every full moon, the phantom's mournful wail could be heard across the moors. It was the sorrowful cry of a spirit forever trapped between worlds, seeking redemption."
        },
        {
            title: "The Strange World of Quantum Entanglement",
            body: "Quantum entanglement is a phenomenon where particles become interconnected, so the state of one instantly influences the state of another, no matter the distance between them."
        },
        {
            title: "Time Dilation Explained",
            body: "Time dilation, a concept from Einstein's theory of relativity, means that time passes differently for objects moving at high speeds or in strong gravitational fields compared to those at rest."
        },
        {
            title: "The Wonders of Superconductors",
            body: "Superconductors are materials that can conduct electricity with zero resistance when cooled to very low temperatures, leading to fascinating applications like maglev trains and MRI machines."
        },
        {
            title: "The Mystery of Dark Matter",
            body: "Dark matter makes up about 27% of the universe, yet it cannot be seen directly. It doesn't emit light or energy, but its presence is inferred from gravitational effects on visible matter."
        },
        {
            title: "The Double-Slit Experiment",
            body: "The double-slit experiment demonstrated that light and matter can display characteristics of both waves and particles, highlighting the dual nature of quantum mechanics."
        },
    ])
}
insertPostData();
*/