class PasswordsController < Devise::PasswordsController
  require 'uri'
  # GET /resource/password/new
  # def new
  #   super
  # end

  def edit
    self.resource = resource_class.find_or_initialize_with_error_by(:reset_password_token, params[:reset_password_token])
    @user = resource
  end
  # protected

  def after_resetting_password_path_for(resource)
    "/#/log-in"
  end

  def after_sending_reset_password_instructions_path_for(resource_name)
    @message = URI.encode("An email was sent to your account. Please confirm to reset your password.")
    "/#/log-in/"+@message
  end
end
