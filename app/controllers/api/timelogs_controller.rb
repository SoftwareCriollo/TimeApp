class Api::TimelogsController <  ApiController

  def create
    @timelog = Timelog.new(timelog_params)

    if  @timelog.save
      render json: @timelog, status: 201, notice: "Successfully created Timelog"
    else
      render json: @timelog, status: 422
    end
  end

  def timelog_params
    params.require(:timelog).permit(:project_id, :project_name, :task_id, :comment, :time, :user_id, :fecha, :trello, :iteration_id, :value_ajust)
  end 

end
