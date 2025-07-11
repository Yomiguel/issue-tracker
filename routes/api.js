'use strict';
const Issue = require('../models/issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(async (req, res) => {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res
          .status(400)
          .json({ error: 'required field(s) missing' });
      }

      try {
        const issue = new Issue({
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          project
        });

        const savedIssue = await issue.save();
        res
          .status(201)
          .json(savedIssue);
      } catch (err) {
        res
          .status(500)
          .json({ error: 'error saving issue' });
      }
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
