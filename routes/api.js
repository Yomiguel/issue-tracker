'use strict';
const Issue = require('../models/issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      const project = req.params;
      const querys = req.query;

      try {
        let filterQuery = {};
        if (querys) {

          filterQuery = Object.fromEntries(
            Object.entries(querys).filter((query) => {
              return query
            })
          );
        }

        const filter = { ...project, ...filterQuery };
        const issues = await Issue.find(filter);

        res
          .status(200)
          .send(issues);

      } catch (err) {
        res
          .status(404)
          .json({ error: 'No document with these characteristics was found.' });
      }
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
