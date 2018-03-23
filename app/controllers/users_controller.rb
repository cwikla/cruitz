class UsersController < ApplicationController
  def me
    render json: current_user
  end

  def recruiters
    @recruiters = params[:all] ? User.is_recruiter.all : current_user.recruiters # FIXME
    render json: @recruiters, each_serializer: RecruiterSerializer
  end

  def recruiter
    @recruiter = User.find_recruiter(params[:id])
    render json: @recruiter, serializer: RecruiterSerializer, reviews: true
  end

  def password
    pwd = params.require(:user).require(:password)
    current_user.password = pwd
    if current_user.save
      bypass_sign_in(current_user)
    end

    render json: current_user
  end

  def update
    up = user_params
    up.delete :password # no doing here!

    if up[:logo] # should refactor this out
      upload = Upload.find(cp[:logo])
      if upload.user_id == current_user.id  # make sure it's owned 
        puts "CMPY UPDATE"
        puts upload.inspect
        up[:logo] = upload
        puts up.inspect
      end
    end

    @user = current_user

    if @user.update(up)
      puts "#{@user.inspect}"
      result = render json: @user
      puts result
      return result
    else
      return render_create_error json: @user
    end
  end


  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :logo)
  end

  


end
