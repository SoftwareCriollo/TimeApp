source 'https://rubygems.org'
ruby '2.1.5'

gem 'rails', '4.1.8'
gem 'rails-api'

gem 'mongoid'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'

gem 'puma'
gem 'slim'

gem 'devise'
gem 'activeadmin', github: 'gregbell/active_admin'
gem 'activeadmin-mongoid', github: 'elia/activeadmin-mongoid', branch: 'rails4'
gem 'ruby-trello'

gem 'bower-rails'
gem 'quiet_assets', group: :development

gem 'dotenv-rails', :groups => [:development, :test]

group :production, :staging do
  gem "rails_12factor"
  gem "rails_stdout_logging"
  gem "rails_serve_static_assets"
end

group :test do
  gem 'rspec-rails'
  gem 'rspec-autotest'
  gem 'factory_girl_rails'
  gem 'capybara'
  gem 'poltergeist'
  gem 'launchy'
  gem 'simplecov', require: false
  gem 'shoulda-matchers'
  gem 'database_cleaner'
end