class Api::MongoidUsersController <  ApiController

  def index
    @users = MongoidUser.all
    render json: @users
  end

end