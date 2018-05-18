ruby '2.4.1'
source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.1'
# Use sqlite3 as the database for Active Record
gem 'pg'
gem 'pg_search'

# Use Puma as the app server
gem 'puma', '~> 3.0'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library

gem 'webpacker'

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
#gem 'jbuilder', '~> 2.5'
gem 'active_model_serializers'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'bullet'
  gem 'byebug', platform: :mri
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'ffaker'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.0.5'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'tether-rails'
gem 'bootstrap', '= 4.0.0.alpha6'

gem 'hashids'

group :production do
  gem 'unicorn'
  #gem 'rails_12factor'
end

#gem 'valium'

#
source "http://pyr:akbash42@gems.cwikla.com" do
  gem 'pyr_gem', "~> 7.0.0"
  #gem 'pyr_gem', :path => "../pyr/pyr_gem"
  gem 'pyr_push', "~> 6.1.0"
#  gem 'pyr_push', :path => "../pyr/pyr_push"
  gem 'pyr_async', "~> 4.0.0"
  #gem 'pyr_async', :path => "../pyr/pyr_async"
  gem 'pyr_geo', "~> 5.0.1"
  #gem 'pyr_geo', :path => "../pyr/pyr_geo"
  gem 'jpyr', "~> 4.0.0"
  #gem 'jpyr', :path => "../pyr/jpyr"
  gem 'pyr_base', '~> 14.0.6'
  #gem 'pyr_base', :path => "../pyr/pyr_base"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
