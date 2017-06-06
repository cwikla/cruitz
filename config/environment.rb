# Load the Rails application.
require_relative 'application'

APP_NAME = "CRUITZ"
TAG_LINE = "Sourcing the World"
COMPANY_NAME = "CRUITZ"

EMAIL_DOMAIN = "cruitz.com"
DEFAULT_APP_MAILER_ADDR = "info@#{EMAIL_DOMAIN}"
EXCEPTION_NOTIFICATION_EMAIL = "cwikla@#{EMAIL_DOMAIN}"

INTERNAL_NOTIFICATION_EMAIL = "cwikla@#{EMAIL_DOMAIN}"

ASSET_BUCKET_NAME = "assets"

USERNAME_REGEX = '[a-zA-Z0-9_]*[a-zA-Z][a-zA-Z0-9_]*'

# Initialize the Rails application.
Rails.application.initialize!
