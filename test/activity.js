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

var activity_ids = []

exports.noActivity = {
  setUp: function (callback) {
    pivotal.getActivity()
  }
}