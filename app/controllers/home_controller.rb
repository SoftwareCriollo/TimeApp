class HomeController < ApplicationController
  def index
    puts current_mongoid_user.inspect
  end
end