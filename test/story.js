var pivotal = require('../index.js'),
    async = require('async'),
    colors  = require("colors"),
    token   = process.env.token || null,
    debug   = (process.env.debug !== undefined),
    projectId = parseInt(process.env.project_id,10) || null,
    storyId = parseInt(process.env.story_id,10) || null,
    projectMemberId = parseInt(process.env.member_id,10) || null;

console.log('projectId', projectId)
pivotal.useToken(token);

var story_ids = [];

// Run array check for no stories
exports.noStories = {
  setUp: function (callback) {
    pivotal.getStories(projectId, { limit : 5 }, function (err, ret) {
      if (ret.story.length === 0) {
        callback()
      } else {
        console.error('Project has stories, unable to test'.red.bold)
        callback('Project has stories, unable to test')
        test.done()
      }
    })
  },
  noStories: function (test) {
    pivotal.getStories(projectId, { limit : 5 }, function (err, ret) {
      test.equal(ret.story.length, 0, 'Story array length === 0')
      test.done()
    })
  }
}

// Run array check for one story
exports.oneStory = {
  setUp: function (callback) {
    pivotal.getStories(projectId, {limit: 3}, function (err, ret) {
      if (ret.story.length !== 0) {
        callback('Project has stories, unable to test'.red.bold)
        test.done()
      } else {
        var storyData = {
            name: 'test'
          , story_type: 'feature'
        }
        pivotal.addStory(projectId, storyData, function (err, ret) {
          if(err) {
            callback()
            test.done()
          }
          story_ids = ret.id
          callback()
        })
      }
        
    })
  },
  oneStory: function (test) {
    pivotal.getStories(projectId, { limit : 5 }, function (err, ret) {
      test.equal(ret.story.length, 1, 'Story array length === 1')
      test.done()
    })
  },
  tearDown: function (callback) {
    pivotal.removeStory(projectId, story_ids, function (err, ret) {
      story_ids = null
      callback()
    })
  }
}

// Run array check for two stories
exports.twoStories = {
  setUp: function (callback) {
    story_ids = []
    pivotal.getStories(projectId, {limit: 3}, function (err, ret) {
      if (ret.story.length !== 0) {
        callback('Project has stories, unable to test'.red.bold)
        test.done()
      } else {

        // Add two stories
        async.parallel ({
          story1: function (cb) {
            var storyData = {
                name: 'test'
              , story_type: 'feature'
            }
            pivotal.addStory(projectId, storyData, function (err, ret) {
              if(err) {
                callback()
                test.done()
              }
              cb(null, ret)
            })    
          },
          story2: function (cb) {
            var storyData2 = {
                name: 'test2'
              , story_type: 'feature'
            }
            pivotal.addStory(projectId, storyData2, function (err, ret) {
              if(err) {
                callback()
                test.done()
              }
              cb(null, ret)
            })
          }
        }, function (err, data) {
          story_ids = [data.story1.id, data.story2.id]
          callback()
        }) 
      }
    })
  },
  twoStories: function (test) {
    pivotal.getStories(projectId, { limit : 5 }, function (err, ret) {
      test.equal(ret.story.length, 2, 'Story array length === 2')
      test.done()
    })
  },
  tearDown: function (callback) {
    var len = story_ids.length
    var count = 0
    for (var i = 0; i<story_ids.length; i++) {
      pivotal.removeStory(projectId, story_ids[i], function (err, ret) {
        count++
        finished()
      })  
    }
    function finished () {
      if (count === len) {
        story_ids = null
        callback()
      }
    }
  }
}