const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: "Please enter a story"
    },
    slug: String,
    created: {
      type: Date,
      default: Date.now
    },
    name: {
      type: String,
      required: "Please provide an author name"
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    gender: {
      type: Number,
      min: 0,
      max: 2
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalOk: {
      type: Number,
      default: 0
    },
    totalNot: {
      type: Number,
      default: 0
    },
    percentOk: {
      type: Number,
      default: 0
    },
    nonbinaryOk: {
      type: Number,
      default: 0
    },
    nonbinaryNot: {
      type: Number,
      default: 0
    },
    femaleOk: {
      type: Number,
      default: 0
    },
    femaleNot: {
      type: Number,
      default: 0
    },
    maleOk: {
      type: Number,
      default: 0
    },
    maleNot: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// Gender Schema
// 0 = Female
// 1 = Male
// 2 = Nonbinary = Other

storySchema.pre("save", async function(next) {
  if (!this.isModified("")) {
    next(); //skip it
    return; //stop function from running
  }
  this.created = Date.now();
  this.slug = slug(this.name ? this.name : this.author);
  // Number the names if they are repeats.
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const storiesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storiesWithSlug.length) {
    this.slug = `${this.slug}-${storiesWithSlug.length + 1}`;
  }
  next();
});

storySchema.statics.updateRatingStats = async function(storyId) {
  const objectId = mongoose.Types.ObjectId(storyId);
  return this.aggregate([
    // lookup stories and populate their ratings
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "story",
        as: "ratings"
      }
    },
    // 	// filter for only items that have 2 or more ratings
    { $match: { _id: { $eq: objectId } } },
    // add values for the statistics fields
    {
      $addFields: {
        totalRatings: { $size: "$ratings" },
        totalOk: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: { $eq: ["$$rate.rating", 1] }
            }
          }
        },
        totalNot: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [{ $eq: ["$$rate.rating", 0] }]
              }
            }
          }
        },
        percentOk: {
          $trunc: { $multiply: [{ $avg: "$ratings.rating" }, 100] }
        },
        nonbinaryOk: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [
                  { $eq: ["$$rate.rating", 1] },
                  { $eq: ["$$rate.gender", 2] }
                ]
              }
            }
          }
        },
        nonbinaryNot: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [
                  { $eq: ["$$rate.rating", 0] },
                  { $eq: ["$$rate.gender", 2] }
                ]
              }
            }
          }
        },
        maleOk: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [
                  { $eq: ["$$rate.rating", 1] },
                  { $eq: ["$$rate.gender", 1] }
                ]
              }
            }
          }
        },
        maleNot: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [
                  { $eq: ["$$rate.rating", 0] },
                  { $eq: ["$$rate.gender", 1] }
                ]
              }
            }
          }
        },
        femaleOk: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [
                  { $eq: ["$$rate.rating", 1] },
                  { $eq: ["$$rate.gender", 0] }
                ]
              }
            }
          }
        },
        femaleNot: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rate",
              cond: {
                $and: [
                  { $eq: ["$$rate.rating", 0] },
                  { $eq: ["$$rate.gender", 0] }
                ]
              }
            }
          }
        }
      }
    }
  ]);
  next();
};

storySchema.statics.getTopResults = function() {
  return this.aggregate([
    // lookup stories and populate their ratings
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "story",
        as: "ratings"
      }
    },
    // filter for only items that have ratings
    { $match: { ratings: { $exists: true } } }
  ]);
};

// find ratings where the story _id property === rating story property
storySchema.virtual("ratings", {
  ref: "Rating", // model to link
  localField: "_id", // field on the story
  foreignField: "story" // field on the rating
});

module.exports = mongoose.model("Story", storySchema);
