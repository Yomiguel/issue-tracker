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

        return res
          .status(200)
          .send(issues);

      } catch (err) {
        return res
          .status(404)
          .json({ error: 'No document with these characteristics was found.' });
      }
    })

    .post(async (req, res) => {
      const project = req.params.project;
      const {
        issue_title = "",
        issue_text = "",
        created_by = "",
        assigned_to,
        status_text
      } = req.body;

      if (!issue_title?.trim() || !issue_text?.trim() || !created_by?.trim()) {
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

        return res
          .status(201)
          .json(savedIssue);
      } catch (err) {
        return res
          .status(500)
          .json({ error: 'error saving issue' });
      }
    })

    .put(async (req, res) => {
      const project = req.params;
      const { _id, ...updateFields } = req.body;

      if (!_id) {
        return res
          .status(400)
          .json({ error: 'missing _id' });
      }

      const updates = {};

      for (let key in updateFields) {
        if (updateFields.hasOwnProperty(key) && key !== '_id') {
          updates[key] = updateFields[key];
        }
      }

      if (!Object.keys(updates).length) {
        return res
          .status(400)
          .json({ error: 'no update field(s) sent', '_id': _id });
      }

      updates.updated_on = new Date();

      try {
        const issueModified = await Issue.findByIdAndUpdate(_id, updates);
        return res
          .status(200)
          .json({ result: 'successfully updated', '_id': _id });
      } catch {
        return res
          .status(500)
          .json({ error: 'could not update', '_id': _id });
      }
    })

    .delete(async (req, res) => {
      const project = req.params.project;
      const _id = req.body._id

      if (!_id) {
        return res
          .status(400)
          .json({ error: 'missing _id' });
      }

      try {
        const deletedIssue = await Issue.findByIdAndDelete(_id);

        if (!deletedIssue) {
          return res.status(500).json({ error: 'could not delete', '_id': _id });
        }
        return res
          .status(200)
          .json({ result: 'successfully deleted', '_id': _id });
      } catch {
        return res
          .status(500)
          .json({ error: 'could not delete', '_id': _id })
      }
    });
};
