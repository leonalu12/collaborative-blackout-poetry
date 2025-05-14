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
  const content1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';
  const blackout1 = await BlackoutDocument.create({
    documentName: 'Blackout Document 1',
    content: content1,
    blackoutWords: getBlackoutIndexes(content1, ['dolor', 'adipiscing']),
    collaborators: [testUser._id],
    state: 'private',
  });

  // Community interaction for document 1
  const interaction1 = await CommunityInteraction.create({
    documentId: blackout1._id,
    likes: [alice._id, bob._id],
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
  const content2 = 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas...';
  const blackout2 = await BlackoutDocument.create({
    documentName: 'Public Document',
    content: content2,
    blackoutWords: getBlackoutIndexes(content2, ['fringilla', 'bibendum']),
    collaborators: [alice._id],
    state: 'public',
  });

  // Public Poem A
  const content4 = 'The rain falls gently on the leaves...';
  const blackout4 = await BlackoutDocument.create({
    documentName: 'Public Poem A',
    content: content4,
    blackoutWords: getBlackoutIndexes(content4, ['rain']),
    collaborators: [bob._id],
    state: 'public',
  });

  // Public Poem B
  const content5 = 'Night whispers secrets to the stars...';
  const blackout5 = await BlackoutDocument.create({
    documentName: 'Public Poem B',
    content: content5,
    blackoutWords: getBlackoutIndexes(content5, ['whispers']),
    collaborators: [charlie._id],
    state: 'public',
  });

  // Public Poem C
  const content6 = 'Beneath the moon, the waves still sing...';
  const blackout6 = await BlackoutDocument.create({
    documentName: 'Public Poem C',
    content: content6,
    blackoutWords: getBlackoutIndexes(content6, ['moon,', 'waves']),
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
