Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.serve_static_assets = true

  config.assets.js_compressor = Uglifier.new(mangle: false)

  config.assets.css_compressor = :sass
  config.assets.compile = false
  config.assets.digest = true
  config.log_level = :info
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.autoflush_log = false
  config.log_formatter = ::Logger::Formatter.new

  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { :host => ENV['ROOT_PATH'] }
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: "smtp.gmail.com",
    port: 587,
    domain: ENV["GMAIL_DOMAIN"],
    authentication: "plain",
    user_name: ENV["GMAIL_USERNAME"],
    password: ENV["GMAIL_PASSWORD"]
  }

end
