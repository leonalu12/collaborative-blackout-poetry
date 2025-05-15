// seed.js
// Import database connection and Mongoose models
const db = require('./config/blackout-db');
const User = require('./models/User');
const BlackoutDocument = require('./models/BlackoutDocument');
const CommunityInteraction = require('./models/CommunityInteraction');
const Comment = require('./models/Comment');

// Utility: split text into tokens including spaces
function tokenize(text) {
  return text.match(/\w+|[^\w\s]|[\s]+/gu) || [];
}

// Utility: find blackout indexes for given words, accounting for spaces as tokens
function getBlackoutIndexes(text, wordsToBlackout) {
  const tokens = tokenize(text);
  const indexes = [];
  tokens.forEach((token, idx) => {
    if (wordsToBlackout.includes(token)) {
      indexes.push({ index: idx, length: 1 });
    }
  });
  return indexes;
}

async function seed() {
  // Connect to MongoDB
  await db();

  // Clean up all collections before seeding
  await Promise.all([
    User.deleteMany({}),
    BlackoutDocument.deleteMany({}),
    CommunityInteraction.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  // Create users
  const [alice, bob, charlie, testUser] = await User.create([
    { name: 'Alice', password: 'hashedpassword123', email: 'alice@example.com' },
    { name: 'Bob', password: 'hashedpassword456', email: 'bob@example.com' },
    { name: 'Charlie', password: 'hashedpassword789', email: 'charlie@example.com' },
    { name: 'Test', password: '78907890', email: 'test@example.com' },
  ]);

  // Seed documents with dynamic blackout indexes

   // Document 1
   const content1 = `at the parades, everyone 
   wants to touch my hair.
   
   on the corner 
   of st charles and marengo, 
   
   i am cold & smashed & puffy AF 
   when two white women 
   try to convince me 
   that they love my hair
   
   no they really really do 
   they say because it is so
   black and thick and curly 
   and soaking up all of the
   water in the damp air. 
   
   the mousy one says
   through an alabama drawl:
   gawd, you can do so much with it 
   
   and her blonde friend says:
   ya can’t do a damn thing with mine, 
   won’t even hold a curl. 
   
   she runs away to grab another friend 
   and says to her: stacey, isn’t it even
   prettier than macy gray’s? 
   we just love her,
   don’t we?
   
   they circle me and ask:
   can we touch your hair?
   
   and then, suddenly,
   just like my ancestors long ago,
   i am pulled apart
   
   soft
   
   by pale hands 
   from all directions.`;
   
     const blackout1 = await BlackoutDocument.create({
       documentName: 'Blackout Document 1',
       content: content1,
       blackoutWords: getBlackoutIndexes(content1, ['grab', 'macy']),
       collaborators: [testUser._id],
       state: 'private',
     });
   
     // Community interaction for document 1
     const interaction1 = await CommunityInteraction.create({
       documentId: blackout1._id,
       Likes: 10,
       comments: [],
     });
     const comment1 = await Comment.create({
       userId: bob._id,
       communityInteractionId: interaction1._id,
       comment: 'Interesting document!',
     });
     interaction1.comments.push(comment1._id);
     await interaction1.save();
   
     // Public document
     const content2 = `I used to lie on the floor for hours after
     school with the phone cradled between
     my shoulder and my ear, a plate of cold
     rice to my left, my school books to my right.
     Twirling the cord between my fingers
     I spoke to friends who recognized the
     language of our realm. Throats and lungs
     swollen, we talked into the heart of the night,
     toying with the idea of hair dye and suicide,
     about the boys who didn’t love us, 
     who we loved too much, the pang
     of the nights. Each sentence was
     new territory, like a door someone was
     rushing into, the glass shattering
     with delirium, with knowledge and fear.
     My Mother never complained about the phone bill,
     what it cost for her daughter to disappear
     behind a door, watching the cord
     stretching its muscle away from her.
     Perhaps she thought it was the only way
     she could reach me, sending me away
     to speak in the underworld.
     As long as I was speaking
     she could put my ear to the tenuous earth
     and allow me to listen, to decipher.
     And these were the elements of my Mother,
     the earthed wire, the burning cable,
     as if she flowed into the room with
     me to somehow say, Stay where I can reach you,
     the dim room, the dark earth. Speak of this
     and when you feel removed from it
     I will pull the cord and take you
     back towards me.`;
     
     const blackout2 = await BlackoutDocument.create({
       documentName: 'Public Document',
       content: content2,
       blackoutWords: getBlackoutIndexes(content2, ['burning', 'feel']),
       collaborators: [alice._id],
       state: 'public',
     });
   
     // Public Poem A
     const content4 = `No man is an island,
   Entire of itself,
   Every man is a piece of the continent,
   A part of the main.
   If a clod be washed away by the sea,
   Europe is the less.
   As well as if a promontory were.
   As well as if a manor of thy friend’s
   Or of thine own were:
   Any man’s death diminishes me,
   Because I am involved in mankind,
   And therefore never send to know for whom the bell tolls;
   It tolls for thee.`;
   
     const blackout4 = await BlackoutDocument.create({
       documentName: 'Public Poem A',
       content: content4,
       blackoutWords: getBlackoutIndexes(content4, ['continent']),
       collaborators: [bob._id],
       state: 'public',
     });
   
     // Public Poem B
     const content5 = `I ask them to take a poem
   and hold it up to the light
   like a color slide
   
   or press an ear against its hive.
   
   I say drop a mouse into a poem
   and watch him probe his way out,
   or walk inside the poem's room
   and feel the walls for a light switch.
   
   I want them to waterski
   across the surface of a poem
   waving at the author's name on the shore.
   
   But all they want to do
   is tie the poem to a chair with rope
   and torture a confession out of it.
   
   They begin beating it with a hose
   to find out what it really means.`;
     const blackout5 = await BlackoutDocument.create({
       documentName: 'Public Poem B',
       content: content5,
       blackoutWords: getBlackoutIndexes(content5, ['surface']),
       collaborators: [charlie._id],
       state: 'public',
     });
   
     // Public Poem C
     const content6 = `April. And the air dry
   As the shoulders of a water buffalo.
   
   Grasshoppers scratch at the dirt,
   rub their wings with thin legs
   flaring out in front of the soldiers
   in low arcing flights, wings a blur.
   
   The soldiers don’t notice anymore,
   seeing only the wreckage of the streets,
   bodies draped with sheets, and the sun,
   how bright it is, how hard and flat and white.
   
   It will take many nails from the coffinmakers
   to shut out this light, which reflects off everything:
   the calloused feet of the dead, their bony hands, 
   their pale foreheads so cold, brilliant in the sun.`;
   
     const blackout6 = await BlackoutDocument.create({
       documentName: 'Public Poem C',
       content: content6,
       blackoutWords: getBlackoutIndexes(content6, ['moon,', 'waves']),
       collaborators: [],
       state: 'public',
     });
   // Public Poem D
   const content7 = `Not every day
   is a good day
   for the elfin tailor.
   Some days
   the stolen cloth
   reveals what it 
   was made for:
   a handsome weskit
   or the jerkin
   of an elfin sailor.
   Other days
   the tailor
   sees a jacket
   in his mind
   and sets about
   to find the fabric.
   But some days
   neither the idea
   nor the material
   presents itself;
   and these are 
   the hard days
   for the tailor elf.`;
   
     const blackout7 = await BlackoutDocument.create({
       documentName: 'Public Poem D',
       content: content7,
       blackoutWords: getBlackoutIndexes(content7, ['fabric,', 'material']),
       collaborators: [],
       state: 'public',
     });
   
   // Public Poem E
   const content8 = `Seems like a long time
   Since the waiter took my order.
   Grimy little luncheonette,
   The snow falling outside.
   
   Seems like it has grown darker
   Since I last heard the kitchen door
   Behind my back
   Since I last noticed
   Anyone pass on the street.
   
   A glass of ice-water
   Keeps me company
   At this table I chose myself
   Upon entering.
   
   And a longing,
   Incredible longing
   To eavesdrop
   On the conversation
   Of cooks.`;
   
   
     const blackout8 = await BlackoutDocument.create({
       documentName: 'Public Poem E',
       content: content8,
       blackoutWords: getBlackoutIndexes(content8, ['grown,', 'conversation']),
       collaborators: [],
       state: 'public',
     });
   
     // Public Poem F
     const content9 = `I’m not yet comfortable with the word,
     its short clean woosh that sounds like
     life. At dinner last night my single girls
     said in admonition, It’s not wife-approved
     about a friend’s upcoming trip. Their
     eyes rolled up and over and out their
     pretty young heads. Wife, why does it
     sound like a job? I want a wife, the famous
     feminist wrote, a wife who will keep my
     clothes clean, ironed, mended, replaced
     when need be. A word that could be made
     easily into maid. A wife that does, fixes,
     soothes, honors, obeys. Housewife,
     fishwife, bad wife, good wife, what’s
     the word for someone who stares long
     into the morning, unable to even fix tea
     some days, the kettle steaming over
     loud like a train whistle, she who cries
     in the mornings, she who tears a hole
     in the earth and cannot stop grieving,
     the one who wants to love you, but often
     isn’t good at even that, the one who
     doesn’t want to be diminished
     by how much she wants to be yours.`;
     
   
     const blackout9 = await BlackoutDocument.create({
       documentName: 'Public Poem F',
       content: content8,
       blackoutWords: getBlackoutIndexes(content9, ['replaced,', 'earth']),
       collaborators: [],
       state: 'public',
     });
   
  // Interaction for Public Document
  const interaction2 = await CommunityInteraction.create({
    documentId: blackout2._id,
    likes: [alice._id, charlie._id],
    comments: [],
  });
  const comment2 = await Comment.create({
    userId: bob._id,
    communityInteractionId: interaction2._id,
    comment: 'Great insights on this document!',
  });
  interaction2.comments.push(comment2._id);
  const comment3 = await Comment.create({
    userId: charlie._id,
    communityInteractionId: interaction2._id,
    comment: 'I found this document very helpful.',
  });
  interaction2.comments.push(comment3._id);
  await interaction2.save();

  // Shared private document
  const content3 = content2; // same text as Public Document
  const blackout3 = await BlackoutDocument.create({
    documentName: 'Shared Document',
    content: content3,
    blackoutWords: getBlackoutIndexes(content3, ['lacus']),
    collaborators: [alice._id, bob._id, charlie._id],
    state: 'private',
  });

  const interaction3 = await CommunityInteraction.create({
    documentId: blackout3._id,
    likes: [bob._id],
    comments: [],
  });

  console.log('✅ Database seeded with users and documents!');
  process.exit();
}

seed();
