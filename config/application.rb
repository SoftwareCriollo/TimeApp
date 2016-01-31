require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "action_controller/railtie"
#require 'active_support'
require "action_mailer/railtie"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module TimeApp
  class Application < Rails::Application
    config.api_only = false
    config.middleware.use ActionDispatch::Flash
    config.middleware.insert_after(
      ActionDispatch::Cookies,
      ActionDispatch::Session::CookieStore,
      key: '_namespace_key')
    config.action_dispatch.cookies_serializer = :json
    config.assets.paths << Rails.root.join("app","assets","typography")
    config.assets.paths << Rails.root.join("vendor","assets","bower_components")
    config.assets.paths << Rails.root.join("vendor","assets","bower_components","bootstrap-sass-official","assets","fonts")
 
    config.assets.precompile << %r(.*.(?:eot|svg|ttf|woff)$)
  end
end
