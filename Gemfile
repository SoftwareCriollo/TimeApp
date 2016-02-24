source 'https://rubygems.org'
#ruby '2.0.0'
ruby '2.1.2'

gem 'rails', '4.1.8'
gem 'rails-api'
gem 'sass-rails'
gem 'mongoid', '4.0.1'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'json'
gem 'multi_json', '1.5.1'

gem 'puma'
gem 'slim'

gem 'simple_form'
gem 'devise', '3.4.1'
gem 'ransack',             github: 'Zhomart/ransack', branch: 'mongoid'
gem 'activeadmin',         github: 'Zhomart/active_admin', branch: 'mongoid-old'

gem 'formtastic'
gem 'formtastic-bootstrap', '~> 3.0.0'
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
  gem 'autotest-rails'
  gem 'factory_girl_rails'
  gem 'capybara'
  gem 'poltergeist'
  gem 'launchy'
  gem 'simplecov', require: false
  gem 'shoulda-matchers'
  gem 'database_cleaner'
end
