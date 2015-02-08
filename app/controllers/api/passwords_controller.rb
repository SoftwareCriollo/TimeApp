class Api::PasswordsController < Devise::PasswordsController
  # GET /resource/password/new
  # def new
  #   super
  # end

  def create
    super
  end

  def edit
    self.resource = resource_class.find_or_initialize_with_error_by(:reset_password_token, params[:reset_password_token])
    @user = resource
  end
  # protected

  def after_resetting_password_path_for(resource)
    "/#/log-in"
  end

  def after_sending_reset_password_instructions_path_for(resource_name)
    "/#/log-in"
  end
end
