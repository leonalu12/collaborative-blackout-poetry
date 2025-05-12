// seed.js
// Import database connection and Mongoose models
const db = require('./config/blackout-db');
const User = require('./models/User');
const BlackoutDocument = require('./models/BlackoutDocument');
const CommunityInteraction = require('./models/CommunityInteraction');
const Comment = require('./models/Comment');

async function seed() {
  // Connect to MongoDB
  await db();

  // Clean up all collections before seeding (delete all documents)
  await Promise.all([
    User.deleteMany({}),
    BlackoutDocument.deleteMany({}),
    CommunityInteraction.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  // Create 4 users: Alice, Bob, Charlie, and Test
  const [alice, bob, charlie, testUser] = await User.create([
    { name: 'Alice', password: 'hashedpassword123', email: 'alice@example.com' },
    { name: 'Bob', password: 'hashedpassword456', email: 'bob@example.com' },
    { name: 'Charlie', password: 'hashedpassword789', email: 'charlie@example.com' },
    { name: 'Test', password: '78907890', email: 'test@example.com' },
  ]);

  // Create a private blackout document with Alice as the only collaborator
  const blackout1 = await BlackoutDocument.create({
    documentName: 'Blackout Document 1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    // Blackout "dolor" (index 2) and "adipiscing" (index 5)
    blackoutWords: [ { index: 2 }, { index: 5 } ],
    collaborators: [alice._id],
    state: 'private',
  });

  // Create a community interaction for blackout1
  const interaction1 = await CommunityInteraction.create({
    documentId: blackout1._id,
    Likes: 10,
    comments: [],
  });

  // Add a comment from Bob to interaction1
  const comment1 = await Comment.create({
    userId: bob._id,
    communityInteractionId: interaction1._id,
    comment: 'Interesting document!',
  });
  interaction1.comments.push(comment1._id);
  await interaction1.save();

  // Create public blackout documents with sample blackoutWords
  const blackout2 = await BlackoutDocument.create({
    documentName: 'Public Document',
    content: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
    // Blackout "fringilla" (index 2) and "bibendum" (index 7)
    blackoutWords: [ { index: 2 }, { index: 7 } ],
    collaborators: [alice._id],
    state: 'public',
  });

  const blackout4 = await BlackoutDocument.create({
    documentName: 'Public Poem A',
    content: 'The rain falls gently on the leaves...',
    // Blackout "rain" (index 1)
    blackoutWords: [ { index: 1 } ],
    collaborators: [bob._id],
    state: 'public',
  });

  const blackout5 = await BlackoutDocument.create({
    documentName: 'Public Poem B',
    content: 'Night whispers secrets to the stars...',
    // Blackout "whispers" (index 1)
    blackoutWords: [ { index: 1 } ],
    collaborators: [charlie._id],
    state: 'public',
  });

  const blackout6 = await BlackoutDocument.create({
    documentName: 'Public Poem C',
    content: 'Beneath the moon, the waves still sing...',
    // Blackout "moon," (index 2) and "waves" (index 5)
    blackoutWords: [ { index: 2 }, { index: 5 } ],
    collaborators: [],
    state: 'public',
  });

  // Community interaction for blackout2
  const interaction2 = await CommunityInteraction.create({
    documentId: blackout2._id,
    Likes: 13,
    comments: [],
  });

  // Add comments to interaction2
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

  // Shared private document between Alice, Bob, and Charlie
  const blackout3 = await BlackoutDocument.create({
    documentName: 'Shared Document',
    content: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
    // Blackout "lacus" (index 4)
    blackoutWords: [ { index: 4 } ],
    collaborators: [alice._id, bob._id, charlie._id],
    state: 'private',
  });

  const interaction3 = await CommunityInteraction.create({
    documentId: blackout3._id,
    Likes: 13,
    comments: [],
  });

  console.log('✅ Database seeded with users and documents!');
  process.exit();
}

seed();
