class VoteController < ApplicationController

  def save
    vote = Vote.new(vote: params[:vote], client_id: params[:client_id])
    if vote.save
      render "/votes/thanks", :layout => false
    end
  end

  def index
    @votes = Vote.all
    render 'votes/index'
  end

  private

  def vote_params
    params.require(:vote).permit(:client_id, :date, :vote)
  end

end
