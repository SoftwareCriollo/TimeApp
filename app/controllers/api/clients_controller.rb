class Api::ClientsController <  ApiController

  def create
    @client= Client.new(client_params)
    if  @client.save
      render json: @client, status: :created
    else
      render json: @client.errors.messages, status: :unprocessable_entity
    end
  end

  def index
    @client = Client.find_or_initialize_by(project_id: params[:project_id])
    render json: @client
  end

  def client_params
    params.require(:client).permit(:project_id, :name, :email, :git, :ssh)
  end


end
