class ApiAuthenticatedController < ActionController::API
  before_action :restrict_access

  def current_user
    @current_user
  end

  private
    def restrict_access
      token = request.headers["HTTP_TOKEN"]
      @current_user = User.find_by_access_token(token)
      head :unauthorized unless @current_user
    end
end
