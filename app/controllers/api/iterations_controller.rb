class Api::IterationsController <  ApiController

  def create
    @iteration= Iteration.new(iteration_params)

    if  @iteration.save
      render json: @iteration, status: 201, notice: "Successfully created Iteration"
    else
      render json: @iteration, status: 422
    end
  end

  def iteration_params
    params.require(:iteration).permit(:project_id, :time, :note, :start, :end_date)
  end 

end
