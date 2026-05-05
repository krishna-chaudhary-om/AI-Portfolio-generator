import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  url: String,
  github: String,
  image: String,
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  current: { type: Boolean, default: false },
  description: String,
  achievements: [String],
}, { _id: false });

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startYear: String,
  endYear: String,
  gpa: String,
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  shareId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: { type: String, default: 'My Portfolio' },
  theme: {
    type: String,
    enum: ['professional', 'creative', 'minimal', 'dark', 'vibrant'],
    default: 'professional',
  },
  layout: {
    type: String,
    enum: ['single-page', 'multi-section', 'card-grid'],
    default: 'single-page',
  },
  tone: {
    type: String,
    enum: ['professional', 'casual', 'bold'],
    default: 'professional',
  },

  // Parsed resume data
  rawText: { type: String, select: false },

  // Generated portfolio content
  content: {
    hero: {
      name: String,
      tagline: String,
      bio: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },
    skills: {
      technical: [String],
      soft: [String],
      languages: [String],
    },
    experience: [experienceSchema],
    projects: [projectSchema],
    education: [educationSchema],
  },

  // Meta
  isPublic: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  views: { type: Number, default: 0 },
  generationStatus: {
    type: String,
    enum: ['pending', 'processing', 'complete', 'failed'],
    default: 'pending',
  },
  generationError: { type: String, default: null },
}, {
  timestamps: true,
});

portfolioSchema.index({ owner: 1, createdAt: -1 });
portfolioSchema.index({ shareId: 1 });
portfolioSchema.index({ isPublic: 1, views: -1 });

export default mongoose.model('Portfolio', portfolioSchema);
