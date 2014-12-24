class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
 # protect_from_forgery with: :null_session

#  rescue_from ActionController::InvalidAuthenticityToken do |exception|
#    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
#    render error: 'invalid token', status: :unprocessable_entity
#  end

end
