class Api::IterationsController <  ApiController
  def create
    @iteration= Iteration.new(iteration_params)
    if  @iteration.save
      render json: @iteration, status: :created
    else
      render json: @iteration.errors.messages, status: :unprocessable_entity
    end
  end

  def timelogs
    @iteration = Iteration.find(params[:id]).timelogs
    render json: @iteration
  end

  def update
    @iteration = Iteration.find(params[:id])
    if @iteration.update(iteration_params)
      render json: @iteration, status: 201, notice: "Successfully updated Iteration"
    else
      render json: @iteration.errors.messages, status: 422
    end
  end

  def show
    @iteration = Iteration.find(params[:id])
    render json: @iteration
  end

  def index
    @iterations = Iteration.by_project(params[:project_id])
    render json: @iterations
  end

  def iteration_params
    params.require(:iteration).permit(:project_id, :time, :note, :start, :end_date, :invoice)
  end

end
