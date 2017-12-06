# Load the Rails application.
require_relative 'application'

APP_NAME = "CRUITZ"
TAG_LINE = "Sourcing the World"
COMPANY_NAME = "CRUITZ"

HOSTNAME = ENV["HOSTNAME"] || "cruitz.com"
EMAIL_DOMAIN = "cruitz.com"
DEFAULT_APP_MAILER_ADDR = "info@#{EMAIL_DOMAIN}"
EXCEPTION_NOTIFICATION_EMAIL = "cwikla@#{EMAIL_DOMAIN}"

INTERNAL_NOTIFICATION_EMAIL = "cwikla@#{EMAIL_DOMAIN}"

S3_BUCKET_SUBDIR = "assets"

USERNAME_REGEX = '[a-zA-Z0-9_]*[a-zA-Z][a-zA-Z0-9_]*'

AWS_ACCESS_KEY_ID = "AKIAJIDSL5XUCGPYF33Q"
AWS_SECRET_ACCESS_KEY = "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"
AWS_REGION = "us-west-1"

#ROOT_BUCKET_PREFIX = "com.cruitz." + Rails.env[0]

S3_BUCKET_NAME = APP_NAME.downcase + '-' + Rails.env.downcase

# Initialize the Rails application.
Rails.application.initialize!
