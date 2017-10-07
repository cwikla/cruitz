
Pyr::Base::Engine.config.pyr_api_key = "Cruitz"
Pyr::Base::Engine.config.pyr_api_secret = "RecruitMe"

#ActionMailer::Base.smtp_settings = {
#  :user_name => ENV['SENDGRID_USERNAME'],
#  :password => ENV['SENDGRID_PASSWORD'],
#  :domain => 'cruitz.com',
#  :address => 'smtp.sendgrid.net',
#  :port => 587,
#  :authentication => :plain,
#  :enable_starttls_auto => true
#}

ActionMailer::Base.default :from => "no-reply@cruitz.com"
