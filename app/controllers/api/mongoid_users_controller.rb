class Api::MongoidUsersController <  ApiController

  def index
    @users = MongoidUser.active_users
    render json: @users
  end

  def find_user
  	@user = MongoidUser.find(params[:user_id])
    render json: @user
  end

end