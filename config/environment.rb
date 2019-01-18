# Load the Rails application.
require_relative 'application'

APP_NAME = "CRUITZ"
TAG_LINE = "Sourcing the World"
COMPANY_NAME = "cruitz"

HOSTNAME = ENV["HOSTNAME"] || "cruitz.com"
EMAIL_DOMAIN = "cruitz.com"
SUPPORT_EMAIL = "support@" + EMAIL_DOMAIN

APP_MAILER_ADDR = "info@#{EMAIL_DOMAIN}"
EXCEPTION_NOTIFICATION_EMAIL = "site-error@#{EMAIL_DOMAIN}"

INTERNAL_NOTIFICATION_EMAIL = "site-error@#{EMAIL_DOMAIN}"

USERNAME_REGEX = '[a-zA-Z0-9_]*[a-zA-Z][a-zA-Z0-9_]*'

AWS_ACCESS_KEY_ID = ENV["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = ENV["AWS_SECRET_ACCESS_KEY"]
AWS_REGION = "us-west-1"

#ROOT_BUCKET_PREFIX = "com.cruitz." + Rails.env[0]

S3_BUCKET_NAME = "assets"

# Initialize the Rails application.
Rails.application.initialize!
