Rails.application.routes.draw do

  root 'home#index'

  get "/votes/:client_id/:vote", to: "vote#save", as: 'save'
  get "/votes", to: "vote#index", as:"index"
  
  namespace :api do
    resources :projects, only: :index do 
      member do
        get :cards
      end
      resources :iterations, only: [:create,:index, :show, :update],shallow: true do
        member do
          get 'timelogs'
          get 'performance'
        end
      end
      resources :clients, only: [:create, :index, :update]
    end
    resources :timelogs, only: [:create,:index,:update]
    resources :mongoid_users, only: [:index]
    get('/timeline/:project_id', to: 'timeline#index')
    get('/timeline/member/:member_id', to: 'timeline#member_timeline')
    get('/timeline', to: 'timeline#all_timeline')
  end

  namespace :api do
    post "/change_password/:reset_password_token", to: "change_password#change_password", as: 'change_password'
    get "/projects/:project_id", to: "projects#name"
    get "/clients", to: "clients#index"
    get "/mongoid_users/:user_id", to: "mongoid_users#find_user"
    get "/projects/:project_id/card/:card_id/logs", to: "timelogs#get_by_card"    
  end

  devise_for :mongoid_users,controllers: {
    sessions: "sessions",
    passwords: "passwords"
  }

end
