class Api::ChangePasswordController < ApplicationController
  def change_password
    @user = MongoidUser.find_or_initialize_with_error_by(:reset_password_token, params[:reset_password_token])
    if @user.update(params_password)
      redirect_to root_path
    else
      render template: "devise/passwords/edit"
    end
  end

  def params_password
    params.require(:mongoid_user).permit(:password,:password_confirmation)
  end
end
