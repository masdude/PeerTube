'use strict'

const validator = require('express-validator').validator

const constants = require('../../initializers/constants')
const usersValidators = require('./users')
const miscValidators = require('./misc')
const VIDEOS_CONSTRAINTS_FIELDS = constants.CONSTRAINTS_FIELDS.VIDEOS

const videosValidators = {
  isEachRemoteVideosValid,
  isVideoAuthorValid,
  isVideoDateValid,
  isVideoDescriptionValid,
  isVideoDurationValid,
  isVideoInfoHashValid,
  isVideoNameValid,
  isVideoPodHostValid,
  isVideoTagsValid,
  isVideoThumbnailValid,
  isVideoThumbnail64Valid
}

function isEachRemoteVideosValid (requests) {
  return miscValidators.isArray(requests) &&
    requests.every(function (request) {
      const video = request.data
      return (
        isRequestTypeAddValid(request.type) &&
        isVideoAuthorValid(video.author) &&
        isVideoDateValid(video.createdAt) &&
        isVideoDescriptionValid(video.description) &&
        isVideoDurationValid(video.duration) &&
        isVideoInfoHashValid(video.infoHash) &&
        isVideoNameValid(video.name) &&
        isVideoTagsValid(video.tags) &&
        isVideoThumbnail64Valid(video.thumbnailBase64) &&
        isVideoRemoteIdValid(video.remoteId) &&
        isVideoExtnameValid(video.extname)
      ) ||
      (
        isRequestTypeRemoveValid(request.type) &&
        isVideoNameValid(video.name) &&
        isVideoRemoteIdValid(video.remoteId)
      )
    })
}

function isVideoAuthorValid (value) {
  return usersValidators.isUserUsernameValid(value)
}

function isVideoDateValid (value) {
  return validator.isDate(value)
}

function isVideoDescriptionValid (value) {
  return validator.isLength(value, VIDEOS_CONSTRAINTS_FIELDS.DESCRIPTION)
}

function isVideoDurationValid (value) {
  return validator.isInt(value + '', VIDEOS_CONSTRAINTS_FIELDS.DURATION)
}

function isVideoExtnameValid (value) {
  return VIDEOS_CONSTRAINTS_FIELDS.EXTNAME.indexOf(value) !== -1
}

function isVideoInfoHashValid (value) {
  return validator.isLength(value, VIDEOS_CONSTRAINTS_FIELDS.INFO_HASH)
}

function isVideoNameValid (value) {
  return validator.isLength(value, VIDEOS_CONSTRAINTS_FIELDS.NAME)
}

function isVideoPodHostValid (value) {
  // TODO: set options (TLD...)
  return validator.isURL(value)
}

function isVideoTagsValid (tags) {
  return miscValidators.isArray(tags) &&
         validator.isInt(tags.length, VIDEOS_CONSTRAINTS_FIELDS.TAGS) &&
         tags.every(function (tag) {
           return validator.isAlphanumeric(tag) &&
                  validator.isLength(tag, VIDEOS_CONSTRAINTS_FIELDS.TAG)
         })
}

function isVideoThumbnailValid (value) {
  return validator.isLength(value, VIDEOS_CONSTRAINTS_FIELDS.THUMBNAIL)
}

function isVideoThumbnail64Valid (value) {
  return validator.isBase64(value) &&
         validator.isByteLength(value, VIDEOS_CONSTRAINTS_FIELDS.THUMBNAIL64)
}

function isVideoRemoteIdValid (value) {
  return validator.isUUID(value, 4)
}

// ---------------------------------------------------------------------------

module.exports = videosValidators

// ---------------------------------------------------------------------------

function isRequestTypeAddValid (value) {
  return value === 'add'
}

function isRequestTypeRemoveValid (value) {
  return value === 'remove'
}
