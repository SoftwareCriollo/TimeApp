class ApiAuthenticatedController < ActionController::API
  before_filter :restrict_access

  def current_user
    @current_user
  end

  private
    def restrict_access
      puts request.headers.inspect
      token = request.headers["HTTP_TOKEN"]
      @current_user = User.find_by_access_token(token)
      head :unauthorized unless @current_user
    end
end
