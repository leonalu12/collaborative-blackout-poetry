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

  // Create 3 users: Alice, Bob, and Charlie
  const [alice, bob, charlie] = await User.create([
    {
      name: 'Alice',
      password: 'hashedpassword123',
      email: 'alice@example.com',
    },
    {
      name: 'Bob',
      password: 'hashedpassword456',
      email: 'bob@example.com',
    },
    {
      name: 'Charlie',
      password: 'hashedpassword789',
      email: 'charlie@example.com',
    },
  ]);

  // Create a private blackout document with Alice as the only collaborator
  const blackout1 = await BlackoutDocument.create({
    documentName: 'Blackout Document 1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    blackoutContent: 'Lorem consectetur elit ut labore Ut',
    collaborators: [alice._id],
    state: 'private', // This document is private
  });

  // Create a community interaction for blackout1
  const interaction1 = await CommunityInteraction.create({
    documentId: blackout1._id,
    Likes: 10,
    comments: [], // Will be filled later
  });

  // Add a comment from Alice to interaction1
  const comment1 = await Comment.create({
    userId: bob._id,
    communityInteractionId: interaction1._id,
    comment: 'Interesting document!',
  });

  // Push the comment into the interaction and save
  interaction1.comments.push(comment1._id);
  await interaction1.save();

  // Create a public blackout document (no restrictions)
  const blackout2 = await BlackoutDocument.create({
    documentName: 'Public Document',
    content: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
    blackoutContent: '',
    collaborators: [alice._id], // Even though it's public, Alice is listed as a collaborator
    state: 'public', // Public document
  });

  // Create a community interaction for blackout2
  const interaction2 = await CommunityInteraction.create({
    documentId: blackout2._id,
    Likes: 13,
    comments: [],
  });

  // Add a comment from Bob to interaction2
  const comment2 = await Comment.create({
    userId: bob._id,
    communityInteractionId: interaction2._id,
    comment: 'Great insights on this document!',
  });

  interaction2.comments.push(comment2._id);

  // Add a comment from Charlie to interaction2
  const comment3 = await Comment.create({
    userId: charlie._id,
    communityInteractionId: interaction2._id,
    comment: 'I found this document very helpful.',
  });

  interaction2.comments.push(comment3._id);

  // Save interaction2 with both comments
  await interaction2.save();

  // Create a private document shared between Alice, Bob, and Charlie
  const blackout3 = await BlackoutDocument.create({
    documentName: 'Shared Document',
    content: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
    blackoutContent: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
    collaborators: [alice.id, bob._id, charlie._id], // Note: alice.id should be alice._id for consistency
    state: 'private',
  });

  // Create a community interaction for blackout3 (no comments yet)
  const interaction3 = await CommunityInteraction.create({
    documentId: blackout3._id,
    Likes: 13,
    comments: [],
  });

  // Log success and exit the process
  console.log('✅ Database seeded with users and documents!');
  process.exit();
}

seed();